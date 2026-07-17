#Python Server
from flask import Flask
import subprocess
import json
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
#information is the value of the dictionary that we're using. 
information = {
	"now_playing": {
		"song_playerstate": False, 
		"track": None, 
		"artist": None,  
		"album_art":None,
		"duration":None,
		"position": None
	}, 
}

#@app.route("/glancer/music_test")

#this function takes in inputs and then assigns values to dict(information) based on them. yes inefficient. no idc
def update_server(playing, track, artist, photo, duration, position):
	information["now_playing"]["song_playerstate"] = playing
	information["now_playing"]["track"] = track
	information["now_playing"]["artist"] = artist
	information["now_playing"]["album_art"] = photo
	information["now_playing"]["duration"] = duration
	information["now_playing"]["position"] = position

#this is the app route. what the hyper is going to call essentially. handles erros, and sets stuff together. 
@app.route("/glancer/music")
def serve_info():
	result = subprocess.run(["osascript", "music_player_info_script.scpt"], capture_output = True, text = True)
	if result.returncode != 0:
		update_server(False, None, None, None, None, None)
		return information

	music_data = json.loads(result.stdout)
	update_server(music_data["song_playerstate"] == "playing", music_data["track"], music_data["artist"], "testing", music_data["duration"], music_data["position"])
	return information


#no clue what this does, scared to touch it :(
if __name__ == "__main__":
	app.run(host="0.0.0.0", port = 8080)

