git clean -fdX *.pyc

npx webpack --mode production

docker-machine env | Invoke-Expression
docker build . -t assetdb
if ($LASTEXITCODE) {
    exit $LASTEXITCODE
}

"# Remove unsued images"
docker system prune -f