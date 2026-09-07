$urls = @(
  'https://spotline888.org/uploads/20251103/e4063309d0783b20b4a4f229b9aeccb2.png',
  'https://spotline888.org/uploads/20251103/eb48feb407a9617a4723f44265c14f96.png',
  'https://spotline888.org/uploads/20251103/6c57613336dc4a7cb082d8267aacf0a1.png',
  'https://spotline888.org/uploads/20251103/e7b47802446b12cea02cff2b5aee1ee3.png',
  'https://spotline888.org/uploads/20251103/0a71c2d5dcfcf70fd748ac23561deda9.png',
  'https://spotline888.org/uploads/20251103/5fb3aee9e34e569992f98e6c4ea05ea0.png',
  'https://spotline888.org/uploads/20250811/72eb62a1a0dfc0df8e874945d8b74614.png',
  'https://spotline888.org/uploads/20250811/d1e1f78eaec7ca09ec6149f1ca92ee14.png',
  'https://spotline888.org/uploads/20250811/d854eb0c968f51dfa1f868c62b535d48.png',
  'https://spotline888.org/uploads/20250811/e93910c5da8cb4c062c3e100f7e4367c.png'
)

foreach ($u in $urls) {
  $rel = $u.Replace('https://spotline888.org/', 'public/')
  Write-Host "Downloading $u to $rel"
  curl.exe -k -s $u -o $rel
}

Get-ChildItem -Recurse public\uploads\2025* | Select-Object Name, Length
