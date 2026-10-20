# Provider root certificate

Public Supabase Root 2021 CA, not a credential. Downloaded over authenticated
HTTPS from the exact URL configured by Supabase's official dashboard:
https://supabase-downloads.s3-ap-southeast-1.amazonaws.com/prod/ssl/prod-ca-2021.crt

Source: `apps/studio/hooks/custom-content/custom-content.json` in
https://github.com/supabase/supabase (read 20 October 2026).
SHA-256 certificate fingerprint:
`80:70:25:AD:50:D4:ED:21:9D:2C:9C:7D:29:9C:00:4F:82:4E:B0:0C:F7:F6:5A:FE:F6:07:D0:7B:72:E6:CA:FA`.

Only the database migration/import connection uses this CA. System trust is
unchanged; certificate and hostname verification remain enabled. Runtime
application requests use Supabase's HTTPS API.
