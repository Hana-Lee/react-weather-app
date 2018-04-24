import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Weather from './Weather';

const OWM_API_KEY = 'f10dd04df4bf97dc175fc2711e72a435';
const MINUS = 273.15;

export default class App extends Component {
	state = {
		isLoaded: false,
		error: null,
		temperature: null,
		tempName: null
	};

	_getWeather = (lat, long) => {
		fetch(
			`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${OWM_API_KEY}`
		)
			.then(response => response.json())
			.then(json => {
				console.log(json);
				this.setState({
					temperature: json.main.temp,
					tempName: json.weather[0].main,
					isLoaded: true
				});
			});
	};

	positionHandler(position) {
		//state.isLoaded = true;
		this.setState({
			isLoaded: true
		});
	}
	getPosition() {
		this.useGetCurrentPositionFn(this.positionHandler);
	}
	useGetCurrentPositionFn(successHandler) {
		navigator.geolocation.getCurrentPosition(
			position => {
				console.log('get current position', position);
				// successHandler(position).bind(this);
				this._getWeather(position.coords.latitude, position.coords.longitude);
				// this.useWatchPositionFn(successHandler);
			},
			error => {
				console.error('get current position error', JSON.stringify(error));
				this.setState({
					error: error
				});
				this.useWatchPositionFn(successHandler);
			},
			{
				enableHighAccuracy: true,
				timeout: 20000,
				maximumAge: 1000,
				distanceFilter: 10
			}
		);
	}
	useWatchPositionFn(successHandler) {
		var watchId = navigator.geolocation.watchPosition(
			position => {
				console.log('watch position', position);
				this.setState({
					isLoaded: true
				});
				navigator.geolocation.clearWatch(watchId);
			},
			error => {
				console.error('watch position error', JSON.stringify(error));
				navigator.geolocation.clearWatch(watchId);
			},
			{
				enableHighAccuracy: true,
				timeout: 20000,
				maximumAge: 1000,
				distanceFilter: 10
			}
		);
	}
	componentDidMount() {
		console.log('componentDidMount');
		this.getPosition();
	}

	render() {
		const { isLoaded, error } = this.state;
		return (
			<View style={styles.container}>
				{isLoaded ? (
					<Weather />
				) : (
					<View style={styles.loading}>
						<Text style={styles.loadingText}>
							Getting the weather informations...
						</Text>
						{error ? <Text style={styles.errorText}>{error}</Text> : null}
					</View>
				)}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		justifyContent: 'flex-start',
		alignItems: 'stretch',
		flexWrap: 'wrap'
	},
	errorText: {
		color: 'red',
		backgroundColor: 'transparent',
		marginBottom: 40
	},
	loading: {
		flex: 1,
		backgroundColor: '#FDF6AA',
		justifyContent: 'flex-end',
		paddingLeft: 25,
		paddingRight: 25
	},
	loadingText: {
		fontSize: 38,
		marginBottom: 24
	}
});
