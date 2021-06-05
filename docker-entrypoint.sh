#!/bin/sh -e
# Motivation: `npm run build` is very slow, the fastest
#             way to get the UI up is `docker pull ... `
#             However, the backend url is hard-coded
#             to be http://localhost:8010/api/v1/
# Purpose:    Overwrite the URL of backend using a user-specified value.
#             `sed` is used to patch the `build/` directory.
#             Next, we downgrade to an underprivileged user
#             before starting the static web server.

target='http://localhost:8010/api/v1/'
api_url="${REACT_APP_STORE_URL-nil}"

if [ "$(id -u)" != "0" ]; then
  if [ "$api_url" != 'nil' ]; then
    echo "WARNING: custom value REACT_APP_STORE_URL=$api_url"
    echo "is set, but container user is not root."
    echo "This ChRIS_store_ui will still point to: $target"
  fi
  exec "$@"
fi

# "http://localhost:8000/api/v1/" --> "http:\/\/localhost:8000\/api\/v1\/"
escape_slash() {
  echo $1 | sed 's/\//\\\//g'
}


if [ "$api_url"  != 'nil' ]; then
  target_pattern=$(escape_slash $target)
  api_url_pattern=$(escape_slash $api_url)
  for build_file in $(find -type f); do
    sed -i -e "s/$target_pattern/$api_url_pattern/g" $build_file
  done
fi

# change to a (random) underprivileged user

PUID=${PUID:=$((RANDOM%50000+10000))}
PGID=${PGID-nil}

if [ "$PGID" = 'nil' ]; then
  adduser -D -u $PUID chris
else
  addgroup -g $PGID chris
  adduser -D -u $PUID -G chris chris
fi

exec su chris -c "$(echo $@)"
