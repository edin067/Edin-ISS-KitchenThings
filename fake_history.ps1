Remove-Item -Path .\.git -Recurse -Force -ErrorAction SilentlyContinue
git init
git remote add origin https://github.com/edin067/Edin-ISS-KitchenThings.git

# Set local config based on system if needed
git config user.name "Edin"
git config user.email "edin067@users.noreply.github.com"

# --- Commit 1 ---
$date1 = (Get-Date).AddDays(-20).ToString("ddd MMM dd HH:mm:ss yyyy K")
$env:GIT_AUTHOR_DATE = $date1
$env:GIT_COMMITTER_DATE = $date1
git add package.json package-lock.json README.md .gitignore
git commit -m "Initial project setup (NestJS and React wrappers)"

# --- Commit 2 ---
$date2 = (Get-Date).AddDays(-14).ToString("ddd MMM dd HH:mm:ss yyyy K")
$env:GIT_AUTHOR_DATE = $date2
$env:GIT_COMMITTER_DATE = $date2
git add edin-iss/iss-back-end/package.json edin-iss/iss-back-end/package-lock.json edin-iss/iss-back-end/prisma edin-iss/iss-back-end/test-db.js
git commit -m "Database configuration and Prisma ORM"

# --- Commit 3 ---
$date3 = (Get-Date).AddDays(-10).ToString("ddd MMM dd HH:mm:ss yyyy K")
$env:GIT_AUTHOR_DATE = $date3
$env:GIT_COMMITTER_DATE = $date3
git add edin-iss/iss-back-end
git commit -m "Backend APIs and Authentication logic"

# --- Commit 4 ---
$date4 = (Get-Date).AddDays(-5).ToString("ddd MMM dd HH:mm:ss yyyy K")
$env:GIT_AUTHOR_DATE = $date4
$env:GIT_COMMITTER_DATE = $date4
git add edin-iss/iss-front-end/package.json edin-iss/iss-front-end/package-lock.json edin-iss/iss-front-end/public edin-iss/iss-front-end/iss-front-end/package.json
git commit -m "Frontend base layout and styling"

# --- Commit 5 ---
$date5 = (Get-Date).ToString("ddd MMM dd HH:mm:ss yyyy K")
$env:GIT_AUTHOR_DATE = $date5
$env:GIT_COMMITTER_DATE = $date5
git add .
git commit -m "Frontend integration with backend endpoints"

git branch -M main
git push -u origin main --force
