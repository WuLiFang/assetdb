$IMAGE = "assetdb"
$CONTAINNER = "assetdb_server"
$SENTRY_DSN = Get-Content .\SENTRY_DSN

"# Setup"
docker-machine env | Invoke-Expression

if ((docker inspect -f="{{.Image}}" $CONTAINNER) -eq
    (docker image inspect -f="{{.Id}}" $IMAGE)) {
    "# No need to update."
    docker start $CONTAINNER
    exit
}

"# Update container"
docker stop $CONTAINNER
docker rm $CONTAINNER
docker run -d `
    -v /z:/z -v /srv/assetdb:/srv/assetdb `
    -p 60001:80 `
    --restart always `
    --link sentry-server:sentry `
    -e SENTRY_DSN=$SENTRY_DSN `
    --name $CONTAINNER $IMAGE
docker ps