$ErrorActionPreference='Stop'
$aitsContentRoot=$PSScriptRoot
$aitsWord=New-Object -ComObject Word.Application
$aitsWord.Visible=$false
$aitsWord.DisplayAlerts=0
try {
 foreach($aitsCourseDir in Get-ChildItem -LiteralPath $aitsContentRoot -Directory -Filter 'course-*') {
  foreach($aitsDocFile in Get-ChildItem -LiteralPath (Join-Path $aitsCourseDir.FullName 'documents') -Filter '*.docx') {
   $aitsDocument=$aitsWord.Documents.Open($aitsDocFile.FullName,$false,$true)
   try {
    $aitsPdfPath=[IO.Path]::ChangeExtension($aitsDocFile.FullName,'.pdf')
    $aitsDocument.ExportAsFixedFormat($aitsPdfPath,17)
    Write-Output ('Rendered '+$aitsCourseDir.Name+'/'+$aitsDocFile.Name)
   } finally { $aitsDocument.Close(0) }
  }
 }
} finally { $aitsWord.Quit() }
