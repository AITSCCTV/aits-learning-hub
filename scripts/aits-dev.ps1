param(
    [ValidateSet('check', 'install', 'services', 'packages', 'migrate', 'dev', 'api', 'web', 'preview', 'proxy', 'build', 'test-web', 'test-api', 'lint-web', 'lint-api')]
    [string]$Action = 'check'
)

$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path $PSScriptRoot -Parent
$originalPath = $env:Path
$originalBaseUrl = $env:TS_NODE_BASEURL
$originalLocation = Get-Location

try {
    Set-Location -LiteralPath $projectRoot
    # Prefer a suitable installed runtime without changing nvm's global selection.
    $runtimeCandidates = @()
    if ($env:AITS_NODE_HOME) { $runtimeCandidates += $env:AITS_NODE_HOME }
    $runtimeCandidates += Join-Path $projectRoot '.local-tools\node\node-v22.15.0-win-x64'
    $runtimeCandidates += Join-Path $env:APPDATA 'nvm\v22.15.0'
    foreach ($candidate in $runtimeCandidates) {
        if (Test-Path -LiteralPath (Join-Path $candidate 'node.exe')) {
            $env:Path = "$candidate;$originalPath"
            break
        }
    }
    $version = (& node --version).TrimStart('v')
    if ($LASTEXITCODE -ne 0 -or [version]$version -lt [version]'22.15.0' -or ([version]$version).Major -ne 22) {
        throw 'Use Node 22.15.0 (the pinned Sentry native profiler lacks a Node 24 binary). Set AITS_NODE_HOME to a Node 22 installation.'
    }
    # Workspace scripts invoke pnpm again; make those children use Corepack too.
    $shimDirectory = Join-Path $projectRoot '.local-tools\shims'
    New-Item -ItemType Directory -Force -Path $shimDirectory | Out-Null
    & corepack enable --install-directory $shimDirectory pnpm
    if ($LASTEXITCODE -ne 0) { throw 'Could not create project-local pnpm shims.' }
    $env:Path = "$shimDirectory;$(Join-Path $projectRoot '.local-tools\caddy');$env:Path"
    if ($Action -eq 'check') {
        Write-Output "Node $version"
        & corepack pnpm --version
        if ($LASTEXITCODE -ne 0) { throw 'Pinned pnpm is unavailable through Corepack.' }
        & docker info --format '{{.ServerVersion}}'
        if ($LASTEXITCODE -ne 0) { throw 'Start Docker Desktop before continuing.' }
        & caddy version
        if ($LASTEXITCODE -ne 0) { throw 'Install Caddy 2.8.4 and add it to PATH.' }
        foreach ($envPath in @('apps/api/.env', 'apps/web/.env')) {
            if (-not (Test-Path -LiteralPath $envPath)) { throw "Missing $envPath; see README setup instructions." }
        }
        Write-Output 'Prerequisites found. This does not verify app startup or database migrations.'
        exit 0
    }
    if ($Action -eq 'api') {
        Set-Location -LiteralPath (Join-Path $projectRoot 'apps/api')
        if (-not (Test-Path -LiteralPath 'dist/src/main.js')) { throw 'Build the API before starting it: corepack pnpm --filter api build' }
        $env:TS_NODE_BASEURL = './dist'
        & node -r tsconfig-paths/register dist/src/main.js
    } elseif ($Action -eq 'web') {
        & corepack pnpm --filter web dev
    } elseif ($Action -eq 'preview') {
        & corepack pnpm --filter web preview
    } elseif ($Action -eq 'proxy') {
        Set-Location -LiteralPath (Join-Path $projectRoot 'apps/reverse-proxy')
        & caddy run
    } elseif ($Action -eq 'services') {
        & docker compose --progress plain up -d
    } else {
        [string[]]$commandArguments = @(switch ($Action) {
            'install' { @('install', '--frozen-lockfile') }
            'packages' { @('packages:build') }
            'migrate' { @('db:migrate') }
            'dev' { @('dev') }
            'build' { @('build') }
            'test-web' { @('test:web', '--run') }
            'test-api' { @('test:api', '--runInBand') }
            'lint-web' { @('lint-tsc-web') }
            'lint-api' { @('lint-tsc-api') }
        })
        & corepack pnpm @commandArguments
    }
    if ($LASTEXITCODE -ne 0) { throw "Action '$Action' failed with exit code $LASTEXITCODE." }
} finally {
    $env:Path = $originalPath
    $env:TS_NODE_BASEURL = $originalBaseUrl
    Set-Location -LiteralPath $originalLocation.Path
}
