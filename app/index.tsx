import React, { useEffect, useRef, useState } from "react";
import {
	StyleSheet,
	Text,
	TouchableOpacity,
	Vibration,
	View,
} from "react-native";

const WORK_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

export default function App() {
	const [isRunning, setIsRunning] = useState(false);
	const [timeLeft, setTimeLeft] = useState(WORK_TIME);
	const [isWorkTime, setIsWorkTime] = useState(true);
	const intervalRef = useRef<number | null>(null);

	useEffect(() => {
		if (isRunning) {
			intervalRef.current = setInterval(() => {
				setTimeLeft((prevTime) => {
					if (prevTime <= 1) {
						Vibration.vibrate();
						clearInterval(intervalRef.current || 0);
						const nextTime = isWorkTime ? BREAK_TIME : WORK_TIME;
						setIsWorkTime(!isWorkTime);
						setIsRunning(false);
						return nextTime;
					}
					return prevTime - 1;
				});
			}, 1000);
		} else {
			clearInterval(intervalRef.current || 0);
		}

		return () => clearInterval(intervalRef.current || 0);
	}, [isRunning]);

	const formatTime = (time: number) => {
		const minutes = Math.floor(time / 60);
		const seconds = time % 60;
		return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
			2,
			"0"
		)}`;
	};

	const handleStartPause = () => {
		setIsRunning((prev) => !prev);
	};

	const handleReset = () => {
		clearInterval(intervalRef.current || 0);
		setIsRunning(false);
		setIsWorkTime(true);
		setTimeLeft(WORK_TIME);
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>
				{isWorkTime ? "Hora de Foco" : "Hora da Pausa"}
			</Text>
			<Text style={styles.timer}>{formatTime(timeLeft)}</Text>
			<View style={styles.buttons}>
				<TouchableOpacity style={styles.button} onPress={handleStartPause}>
					<Text style={styles.buttonText}>
						{isRunning ? "Pausar" : "Iniciar"}
					</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.button} onPress={handleReset}>
					<Text style={styles.buttonText}>Resetar</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#121212",
		alignItems: "center",
		justifyContent: "center",
	},
	title: {
		fontSize: 32,
		color: "#ffffff",
		marginBottom: 20,
	},
	timer: {
		fontSize: 72,
		fontWeight: "bold",
		color: "#ffffff",
	},
	buttons: {
		flexDirection: "row",
		marginTop: 40,
	},
	button: {
		backgroundColor: "#bb86fc",
		paddingVertical: 15,
		paddingHorizontal: 25,
		borderRadius: 12,
		marginHorizontal: 10,
	},
	buttonText: {
		color: "#ffffff",
		fontSize: 18,
	},
});
