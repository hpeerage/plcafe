import { useState, useEffect } from 'react';
import { Barometer } from 'expo-sensors';

const FLOOR_HEIGHT = 3; // 3m per floor
const BASE_ALTITUDE_MAP: Record<number, string> = {
  [-4]: 'B4',
  [-3]: 'B3',
  [-2]: 'B2',
  [-1]: 'B1',
  [0]: '1F',
  [1]: '2F',
  [2]: '3F',
  [3]: '4F', // User mentioned 3F as +9m, but actually 1F(0m), 2F(3m), 3F(6m), 4F(9m)
};

export const useBarometer = () => {
  const [pressure, setPressure] = useState<number>(0);
  const [relativeAltitude, setRelativeAltitude] = useState<number>(0);
  const [currentFloor, setCurrentFloor] = useState<string>('1F');
  const [isAvailable, setIsAvailable] = useState<boolean>(false);
  const [referencePressure, setReferencePressure] = useState<number | null>(null);

  useEffect(() => {
    let subscription: any;

    const checkAvailability = async () => {
      const available = await Barometer.isAvailableAsync();
      setIsAvailable(available);
      if (available) {
        subscription = Barometer.addListener(({ pressure }) => {
          setPressure(pressure);
          
          if (referencePressure === null) {
            setReferencePressure(pressure);
          } else {
            // Altitude Formula: 44330 * (1 - (P/P0)^(1/5.255))
            // Here we calculate relative altitude from the reference pressure
            const altitude = 44330 * (1 - Math.pow(pressure / referencePressure, 1 / 5.255));
            setRelativeAltitude(altitude);
            
            // Map altitude to floor
            const floorIndex = Math.round(altitude / FLOOR_HEIGHT);
            setCurrentFloor(BASE_ALTITUDE_MAP[floorIndex] || '1F');
          }
        });
      }
    };

    checkAvailability();

    return () => {
      subscription?.remove();
    };
  }, [referencePressure]);

  return { pressure, relativeAltitude, currentFloor, isAvailable };
};
