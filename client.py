import requests, threading, sys, RPi.GPIO as GPIO

id = 0

# 
# Requests status data from the server for
# the ID stored as a global
#
# return - none
#
def getStatus():
	data = requests.get("http://localhost:9999/" + id)
	value = False

	if (data.status_code == 200):
		jsonData = data.json()
		if (jsonData["status"]["indicator"] == "S"):
			if (jsonData["data"]["on"]):
				value =  True
			
			
	setOutput(value)
	

#
# Sets the output based on the value passed in.
#
# param value - boolean indicating output state
# return - none
#	
def setOutput(value):
	if (value):
		print("ON")
		GPIO.output(1, 1)
	else: 
		print("OFF")
		GPIO.output(1, 0)
	

#
# Makes a function call at the given interval.
#
# param func - the function to call
# param sec - how many seconds to delay between calls
# return - none
#
def set_interval(func, sec):
    def func_wrapper():
        set_interval(func, sec)
        func()
    t = threading.Timer(sec, func_wrapper)
    t.start()
    return t
	
	
GPIO.setmode(GPIO.BCM)
GPIO.setup(1, GPIO.OUT)
	
# a number must be passed in as the first command line argument indicating the ID of the node
if (len(sys.argv) > 1):
	id = sys.argv[1]
	set_interval(getStatus, 1)
else:
	print("Must pass an id in as the first argument. Eg: python client.py 1")
