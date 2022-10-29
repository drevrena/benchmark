if [[ "$(docker inspect --type=image benchmark:latest 2> /dev/null)" == "[]" ]]; then
  docker build . -t benchmark
fi
docker run -dit benchmark



