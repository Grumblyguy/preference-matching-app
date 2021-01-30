"""
Module for printing out debugging statements. Automatically prints out eprint
statements if '-d' flag given in command line arguments.
"""

import sys

debug_flag = False
on_windows = False
DEBUG_COLOR = '\033[94m'
END_COLOR = '\033[0m'
GREEN_COLOR = '\033[92m'


def eprint(*args, **kwargs):
	"""
	Function for printing out debugging statements. Prints in blue by default.
	Taken from https://stackoverflow.com/questions/5574702/how-to-print-to-stderr-in-python
	"""
	if (debug_flag):
		args = list(args)
		
		# Adding color using escape sequence in front of string, and end color at end of string
		if not on_windows:
			args.insert(0, DEBUG_COLOR)
			args.append(END_COLOR)
		print(*args, file=sys.stderr, **kwargs)

def printGreen(*args, **kwargs):
	"""
	Function for printing out in green.
	"""
	args = list(args)
	# Adding color using escape sequence in front of string, and end color at end of string
	if not on_windows:
		args.insert(0, GREEN_COLOR)
		args.append(END_COLOR)
	print(*args, **kwargs)

# Sets debug flag to be true/false
def setDebug(boolean):
	"""
	Sets debug flag with a boolean. Determines whether eprint prints or not.
	"""
	global debug_flag
	debug_flag = boolean

def ignoreOS(boolean):
	"""
	Sets flag whether to ignore platform or not.
	Most windows terminals do not respect the escape sequences
	used to change the color.
	"""
	on_windows = not boolean
	eprint("Ignoring OS")

if sys.platform.startswith('win'):
	windows = True

# This section automatically sets debug to false and looks through args for debug flag
setDebug(False)	# Sets eprint to not print by default
args = sys.argv

if ('-d' in args):	# Debugging flag '-d' for more messages on current status
	setDebug(True)
	args.remove('-d')