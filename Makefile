SHELL=bash

build:
		echo "Build container"
		docker build --network host -t homer-view:local .

run: 
		echo "Running the container"
		docker run -t homer-view:local