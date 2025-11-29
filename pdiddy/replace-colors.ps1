# PowerShell script to replace gray/neutral colors with cream/brown palette

$rootPath = "c:\Users\joaop\OneDrive\Área de Trabalho\devops-tec-burger-front\pdiddy"

# Define color mappings
$replacements = @{
    # Backgrounds - grayneutral → cream
    'bg-neutral-50' = 'bg-cream-200'
    'bg-neutral-100' = 'bg-cream-100'
    'bg-neutral-200' = 'bg-cream-300'
    'bg-white' = 'bg-cream-50'
    
    # Text - gray/neutral → brown
    'text-neutral-900' = 'text-brown-500'
    'text-neutral-700' = 'text-brown-400'
    'text-neutral-600' = 'text-brown-300'
    'text-neutral-500' = 'text-brown-300'
    'text-neutral-400' = 'text-brown-200'
    'text-neutral-300' = 'text-brown-100'
    
    # Borders - gray/neutral → cream/brown
    'border-neutral-200' = 'border-cream-400'
    'border-neutral-300' = 'border-cream-500'
    'border-neutral-800' = 'border-brown-300'
    
    # Hover states + backgrounds
    'hover:bg-neutral-50' = 'hover:bg-cream-100'
    'hover:bg-neutral-100' = 'hover:bg-cream-200'
    'hover:bg-neutral-200' = 'hover:bg-cream-300'
    'hover:bg-neutral-300' = 'hover:bg-cream-400'
    
    # Hover text
    'hover:text-neutral-600' = 'hover:text-brown-400'
    'hover:text-neutral-700' = 'hover:text-brown-400'
    'hover:text-neutral-900' = 'hover:text-brown-500'
    
    # Hover borders
    'hover:border-neutral-300' = 'hover:border-cream-500'
    'hover:border-neutral-400' = 'hover:border-cream-600'
    
    # Active states
    'active:bg-neutral-100' = 'active:bg-cream-200'
    'active:bg-neutral-200' = 'active:bg-cream-300'
    
    # Disabled states
    'disabled:bg-neutral-100' = 'disabled:bg-cream-200'
    'disabled:bg-neutral-300' = 'disabled:bg-cream-400'
    'disabled:text-neutral-400' = 'disabled:text-brown-200'
    'disabled:border-neutral-300' = 'disabled:border-cream-400'
}

# Get all TypeScript files in components and app directories
$files = Get-ChildItem -Path "$rootPath\components" -Include *.tsx -Recurse
$files += Get-ChildItem -Path "$rootPath\app" -Include *.tsx -Recurse

$filesChanged = 0
$totalReplacements = 0

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw
    $originalContent = $content
    $fileReplacements = 0
    
    foreach ($oldColor in $replacements.Keys) {
        $newColor = $replacements[$oldColor]
        if ($content -match [regex]::Escape($oldColor)) {
            $content = $content -replace [regex]::Escape($oldColor), $newColor
            $count = ([regex]::Matches($originalContent, [regex]::Escape($oldColor))).Count
            $fileReplacements += $count
        }
    }
    
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        $filesChanged++
        $totalReplacements += $fileReplacements
        Write-Host "✓ Updated $($file.Name) - $fileReplacements replacements"
    }
}

Write-Host "`n========================================="
Write-Host "Color Replacement Complete!"
Write-Host "Files changed: $filesChanged"
Write-Host "Total replacements: $totalReplacements"
Write-Host "========================================="
