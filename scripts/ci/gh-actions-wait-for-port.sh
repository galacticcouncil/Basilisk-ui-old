while ! nc -z 127.0.0.1 $1; do
  sleep 1 # wait for 1 second before check again
  echo "Waiting for port $1 ..."
done

echo "Port $1 is open."