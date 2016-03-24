var socket = io();

socket.emit('init', window.location.pathname.substring(1, window.location.pathname.length));

socket.on('init', function(obj) {

    //console.log(obj.players.length);
    console.log(obj.players);

    vm.room = window.location + obj.room;
	vm.playerState = obj;
	if (obj.players.length == 2)
		vm.statusMessage = 'Not ready';

	console.log(obj.players);
	obj.players.forEach(function(e, i) {
		if (e.id != obj.id)
			if (e.ready) {
				vm.opponentReady = true;
				vm.statusMessage = 'Ready';
			}
	});
});

socket.on('canFire', function(obj) {
	// check if current user or opponent can fire
	if(vm.playerState.id == obj.id)
    	vm.canFire = true;
    else
    	vm.canFire = false;
});

socket.on('playerJoined', function() {
	vm.statusMessage = 'Not ready';
});

socket.on('opponentLeft', function () {
	vm.statusMessage = 'Opponent left';
});

socket.on('opponentReady', function() {
	vm.opponentReady = true;
	vm.statusMessage = 'Ready';
	console.log('opponent is ready');
});

socket.on('takeFire', function(obj) {

    if (obj.opponent.takenHits == obj.opponent.locations.length) {
        alert('YOU LOSE!');
    }

	var tile = document.querySelector('[data-cords="'+ obj.cords +'"]');

	if (tile.getAttribute('class') == 'placed-tile') {
		tile.style.backgroundColor = "red";
        vm.statusMessage = 'Opponent turn';
	} else {
		tile.style.backgroundColor = "cornflowerblue";
        vm.statusMessage = 'Your turn';
	}
});

socket.on('hit', function(obj) {

	console.log('hit ' + obj.hit);

	if (obj.hit) {
		document.querySelector('[data-opcords="'+ obj.cords +'"]').style.backgroundColor = "red";
        vm.statusMessage = 'Your turn';
        vm.canFire = true;
	} else {
		document.querySelector('[data-opcords="'+ obj.cords +'"]').style.backgroundColor = "cornflowerblue";
        vm.statusMessage = 'Opponent turn';
        vm.canFire = false;
	}
});

/*-----------------------------------------------------------------------*/

Vue.component('board', {
	template: "#board-template",
	props: ['cols', 'rows'],

	computed: {
		chr: function(n) {
			return String.fromCharCode(65);
		}
	},

	methods: {

		placeShip: function(el) {

			if(this.$root.selectedShip == null || this.$root.selectedShip.amount == 0)
				return;

			var setCords = el.currentTarget.getAttribute('data-cords');
			var size = this.$root.selectedShip.size;

			var hoveredTile = document.querySelectorAll('.tile-hover');

			var overlap = false;

			for (var i = 0; i < size; i++) {

				if(this.$root.rotated) {
					if (parseInt(setCords.split("").reverse().join("")[0]) + size <= this.cols) {
						var e = document.querySelector('[data-cords="'+ (parseInt(setCords) + (i)) +'"]');
						if (e.className == 'placed-tile') overlap = true;
					}
					else {
						var e = document.querySelector('[data-cords="'+ (parseInt(setCords) - (i)) +'"]');
						if (e.className == 'placed-tile') overlap = true;
					}
				} else if (!this.$root.rotated) {
					if (document.querySelector('[data-cords="'+ (parseInt(setCords) + (i * 10)) +'"]') != null) {
						var e = document.querySelector('[data-cords="'+ (parseInt(setCords) + (i * 10)) +'"]');
						if (e.className == 'placed-tile') overlap = true;
					}
					else {
						var e = document.querySelector('[data-cords="'+ (parseInt(setCords) - ((size - i) * 10)) +'"]');
						if (e.className == 'placed-tile') overlap = true;
					}
				}

			}

			if (!overlap) {

				this.$root.selectedShip.amount--;

				for (var i = 0; i < hoveredTile.length; i++) {
					hoveredTile[i].className = 'placed-tile';
				}
			}
		},

		changeStyle: function(el) {

			if(this.$root.selectedShip == null || this.$root.selectedShip.amount == 0)
				return;

			var setCords = el.currentTarget.getAttribute('data-cords');

			var size = this.$root.selectedShip.size;

			for (var i = 0; i < size; i++) {

				if(this.$root.rotated) {
					if (parseInt(setCords.split("").reverse().join("")[0]) + size <= this.cols) {
						var e = document.querySelector('[data-cords="'+ (parseInt(setCords) + (i)) +'"]');
						e.className = e.className == 'placed-tile' ? 'placed-tile' : 'tile-hover';
					}
					else {
						var e = document.querySelector('[data-cords="'+ (parseInt(setCords) - (i)) +'"]');
						e.className = e.className == 'placed-tile' ? 'placed-tile' : 'tile-hover';
					}
				} else if (!this.$root.rotated) {
					if (document.querySelector('[data-cords="'+ (parseInt(setCords) + (i * 10)) +'"]') != null) {
						var e = document.querySelector('[data-cords="'+ (parseInt(setCords) + (i * 10)) +'"]');
						e.className = e.className == 'placed-tile' ? 'placed-tile' : 'tile-hover';
					}
					else {
						var e = document.querySelector('[data-cords="'+ (parseInt(setCords) - ((size - i) * 10)) +'"]');
						e.className = e.className == 'placed-tile' ? 'placed-tile' : 'tile-hover';
					}
				}

			}

		},

		setDef: function(el) {
			if(this.$root.selectedShip == null)
				return;
			var setCords = el.currentTarget.getAttribute('data-cords');

			var size = this.$root.selectedShip.size;

			for (var i = 0; i < size; i++)
				if(this.$root.rotated) {
					if (parseInt(setCords.split("").reverse().join("")[0]) + size <= this.cols) {
						var e = document.querySelector('[data-cords="'+ (parseInt(setCords) + (i * 1)) +'"]');
						e.className  = e.className == 'placed-tile' ? 'placed-tile' : 'tile';
					}
					else {
						var e = document.querySelector('[data-cords="'+ (parseInt(setCords) - ((i) * 1)) +'"]');
						e.className  = e.className == 'placed-tile' ? 'placed-tile' : 'tile';
					}
				} else if (!this.$root.rotated) {
					if (document.querySelector('[data-cords="'+ (parseInt(setCords) + (i * 10)) +'"]') != null) {
						var e = document.querySelector('[data-cords="'+ (parseInt(setCords) + (i * 10)) +'"]');
						e.className  = e.className == 'placed-tile' ? 'placed-tile' : 'tile';
					}
					else {
						var e = document.querySelector('[data-cords="'+ (parseInt(setCords) - ((size - i) * 10)) +'"]');
						e.className  = e.className == 'placed-tile' ? 'placed-tile' : 'tile';
					}
				}
		}
	}

});

Vue.component('opponent-board', {
	template: "#opponent-board-template",
	props: ['cols', 'rows'],

	methods: {
		fire: function(el) {

			if(!(this.$root.ready && this.$root.opponentReady && this.$root.canFire)) return;

			if(el.currentTarget.getAttribute('data-hittable') == 'true') {

				socket.emit('fire', {'playerState': this.playerState, 'cords' : parseInt(el.currentTarget.getAttribute('data-opcords')) } );

				//el.currentTarget.className = 'missed-tile';
				el.currentTarget.setAttribute('data-hittable', 'false');
			} else {
				console.log('not hittable?');
			}
		}
	}

});

Vue.filter('convertChar', function(n) {
	return String.fromCharCode(64+n);
});

var vm = new Vue({
	el: "#game",

	data: {
		ships: [
			{ 'type': 'Aircraft carrier', 'size': 5, 'alive': true, 'hits': 0, 'amount': 1},
			{ 'type': 'Battleship', 'size': 4, 'alive': true, 'hits': 0, 'amount': 0},
			{ 'type': 'Submarine', 'size': 3, 'alive': true, 'hits': 0, 'amount': 0},
			{ 'type': 'Cruiser', 'size': 3, 'alive': true, 'hits': 0, 'amount': 0},
			{ 'type': 'Destroyer', 'size': 2, 'alive': true, 'hits': 0, 'amount': 0}
		],

		selectedShip: null,
		statusMessage: 'Waiting for opponent',
		rotated: false,
		opponentReady: false,
		ready: false,
		playerState: null,
		canFire: false,
        room: null
	},

	methods: {
		setSelectedShip: function(ship) {
			this.selectedShip = ship;
		}
	},

	computed: {

		isHost: function() {
			if (window.location.pathname == '/')
				return true;

			return false;
		},

		ready: function() {
			var ready = true;

			this.ships.forEach(function(element, index) {
				if (element.amount > 0)
					ready = false;
			});

			if (ready) {
				this.ready = true;

				var locs = [];

				var tiles = document.querySelectorAll('.placed-tile');

				

				for (var i = 0; i < tiles.length; i++) 
					locs.push(parseInt(tiles[i].getAttribute('data-cords')));


				socket.emit('ready', {'playerState' : this.playerState, 'locations' : locs });
			}

			return ready;

		}
	}

});

Vue.config.debug = true;