# Supabase database CA

`supabase-ca.crt` is a public CA certificate, downloaded from the certificate link in the project's authenticated Database Settings page on 9 November 2026:

https://supabase-downloads.s3-ap-southeast-1.amazonaws.com/prod/ssl/prod-ca-2021.crt

SHA-256 certificate fingerprint:
`80:70:25:AD:50:D4:ED:21:9D:2C:9C:7D:29:9C:00:4F:82:4E:B0:0C:F7:F6:5A:FE:F6:07:D0:7B:72:E6:CA:FA`

Valid until 26 April 2031. Recheck provider rotation requirements before renewal.

For this deployment, set `NODE_EXTRA_CA_CERTS=/app/certs/supabase-ca.crt` before Node starts and use `sslmode=verify-full` in both database URLs. The image includes the public certificate but does not enable additional trust for deployments that do not set that environment variable. Never set `NODE_TLS_REJECT_UNAUTHORIZED=0` or disable certificate verification.
