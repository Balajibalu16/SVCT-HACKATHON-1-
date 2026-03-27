$foods = @(
  "Rice porridge (kanji)", "Banana", "Watermelon", "Steamed broccoli", "Carrot soup", "Coconut water", "Soft idli",
  "Warm ginger tea", "Soft pear", "Baked apple", "Steamed sweet potato", "Boiled spinach", "Honey and lemon water", "Oatmeal",
  "Saltine crackers", "Applesauce", "Sliced banana", "Plain baked potato", "Steamed squash", "Ginger tea", "Plain toast",
  "White rice", "Puréed apple", "Boiled carrots", "Cooked zucchini", "Clear broth",
  "Complex carbohydrates (quinoa)", "Oranges", "Berries", "Roasted bell peppers", "Steamed kale", "Lean protein", "Light dal"
)

New-Item -ItemType Directory -Force -Path "C:\Users\grand\OneDrive\Desktop\SymptomSenseAI\public\food" | Out-Null

foreach ($food in $foods) {
  $safeName = ($food -replace '\W+', '_').ToLower()
  $url = "https://image.pollinations.ai/prompt/Food%20photography%20of%20" + [uri]::EscapeDataString($food) + ",%20single%20item,%20high%20quality,%20centered?width=200&height=200&nologo=true"
  $path = "C:\Users\grand\OneDrive\Desktop\SymptomSenseAI\public\food\$safeName.jpg"
  
  if (-Not (Test-Path $path)) {
     Write-Host "Downloading: $safeName.jpg"
     Invoke-WebRequest -Uri $url -OutFile $path -UserAgent "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  } else {
     Write-Host "Skip existing: $safeName.jpg"
  }
}
Write-Host "DONE"
