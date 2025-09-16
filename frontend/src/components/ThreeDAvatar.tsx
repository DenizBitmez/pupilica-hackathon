import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Box } from '@react-three/drei';
import { HistoricalFigure } from '../types/historical';
import * as THREE from 'three';

interface ThreeDAvatarProps {
  character: HistoricalFigure;
  isSpeaking?: boolean;
  isListening?: boolean;
  mouthOpen?: number;
}

// 3D Avatar component
const Avatar3D: React.FC<{
  character: HistoricalFigure;
  isSpeaking?: boolean;
  mouthOpen?: number;
}> = ({ character, isSpeaking, mouthOpen }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const mouthRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle breathing animation
      meshRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.02;
      
      // Speaking animation
      if (isSpeaking) {
        meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 8) * 0.1;
      }
    }

    if (mouthRef.current && mouthOpen !== undefined) {
      // Mouth animation based on audio amplitude
      const mouthShapes = [0.1, 0.3, 0.6, 1.0]; // closed to wide open
      const targetScale = mouthShapes[Math.min(3, Math.max(0, mouthOpen))] || 0.3;
      mouthRef.current.scale.y = THREE.MathUtils.lerp(mouthRef.current.scale.y, targetScale, 0.1);
    }
  });

  const getCharacterColor = () => {
    switch (character.id) {
      case 'fatih_sultan_mehmet':
        return '#f59e0b'; // amber
      case 'ataturk':
        return '#dc2626'; // red
      case 'napoleon':
        return '#2563eb'; // blue
      default:
        return '#6b7280'; // gray
    }
  };

  return (
    <group>
      {/* Head */}
      <Sphere ref={meshRef} args={[1, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial color={getCharacterColor()} />
      </Sphere>
      
      {/* Eyes */}
      <Sphere args={[0.1, 16, 16]} position={[-0.3, 0.2, 0.8]}>
        <meshStandardMaterial color="#000000" />
      </Sphere>
      <Sphere args={[0.1, 16, 16]} position={[0.3, 0.2, 0.8]}>
        <meshStandardMaterial color="#000000" />
      </Sphere>
      
      {/* Nose */}
      <Box args={[0.1, 0.2, 0.1]} position={[0, 0, 0.9]}>
        <meshStandardMaterial color={getCharacterColor()} />
      </Box>
      
      {/* Mouth */}
      <Box ref={mouthRef} args={[0.4, 0.1, 0.05]} position={[0, -0.3, 0.8]}>
        <meshStandardMaterial color="#000000" />
      </Box>
      
      {/* Crown/Hat based on character */}
      {character.id === 'fatih_sultan_mehmet' && (
        <Box args={[1.2, 0.3, 0.1]} position={[0, 0.8, 0]}>
          <meshStandardMaterial color="#ffd700" />
        </Box>
      )}
      
      {character.id === 'ataturk' && (
        <Box args={[1.1, 0.2, 0.1]} position={[0, 0.7, 0]}>
          <meshStandardMaterial color="#1f2937" />
        </Box>
      )}
      
      {character.id === 'napoleon' && (
        <Box args={[1.1, 0.4, 0.1]} position={[0, 0.8, 0]}>
          <meshStandardMaterial color="#1f2937" />
        </Box>
      )}
    </group>
  );
};

const ThreeDAvatar: React.FC<ThreeDAvatarProps> = ({
  character,
  isSpeaking,
  isListening,
  mouthOpen
}) => {
  return (
    <div className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden">
      <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <pointLight position={[-5, -5, -5]} intensity={0.4} />
        
        <Avatar3D 
          character={character} 
          isSpeaking={isSpeaking} 
          mouthOpen={mouthOpen}
        />
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          autoRotate={!isSpeaking}
          autoRotateSpeed={1}
        />
      </Canvas>
      
      {/* Status indicator */}
      <div className="absolute bottom-2 left-2 flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${
          isSpeaking ? 'bg-green-500 animate-pulse' :
          isListening ? 'bg-blue-500 animate-bounce' :
          'bg-gray-400'
        }`}></div>
        <span className="text-xs text-gray-600 bg-white/80 px-2 py-1 rounded">
          {isSpeaking ? 'Konuşuyor' : isListening ? 'Dinliyor' : '3D Avatar'}
        </span>
      </div>
    </div>
  );
};

export default ThreeDAvatar;
