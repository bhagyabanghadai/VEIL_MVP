$folderPath = "f:\Startup_Projects\Agent Passport\visuals"
$shell = New-Object -ComObject Shell.Application
$folder = $shell.NameSpace($folderPath)
$file = $folder.Items() | Select-Object -First 1

# Find the index for Frame Width and Frame Height
$widthIndex = -1
$heightIndex = -1

for ($i = 0; $i -lt 500; $i++) {
    $name = $folder.GetDetailsOf($null, $i)
    if ($name -eq "Frame width") { $widthIndex = $i }
    if ($name -eq "Frame height") { $heightIndex = $i }
}

Write-Output "Indices: Width=$widthIndex, Height=$heightIndex"

foreach ($item in $folder.Items()) {
    $w = $folder.GetDetailsOf($item, $widthIndex)
    $h = $folder.GetDetailsOf($item, $heightIndex)
    Write-Output "File: $($item.Name) | Resolution: $w x $h"
}
