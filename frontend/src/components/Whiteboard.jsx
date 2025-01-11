import { useRef, useState, useEffect } from 'react';

const Whiteboard = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  const [currentShape, setCurrentShape] = useState(null); // Track the selected shape
  const [shapes, setShapes] = useState([]); // Store the shapes drawn

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Set canvas defaults
    context.lineWidth = 5;
    context.lineCap = 'round';
    context.strokeStyle = 'black';

    // Load saved drawing from localStorage if it exists
    const savedDrawing = localStorage.getItem('whiteboardDrawing');
    if (savedDrawing) {
      const img = new Image();
      img.src = savedDrawing;
      img.onload = () => {
        context.drawImage(img, 0, 0); // Draw the saved image onto the canvas
      };
    }
  }, []);

  const saveToLocalStorage = () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL(); // Get canvas content as a base64 string
    localStorage.setItem('whiteboardDrawing', dataURL); // Save to localStorage
  };

  const startDrawing = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    setLastPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    saveToLocalStorage(); // Save the canvas content when drawing stops
  };

  const draw = (e) => {
    if (!isDrawing || !currentShape) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();

    const currentPosition = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    // Clear the current drawing before drawing new shapes
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Redraw saved shapes
    drawShapes();

    context.beginPath();

    if (currentShape === 'rectangle') {
      context.rect(lastPosition.x, lastPosition.y, currentPosition.x - lastPosition.x, currentPosition.y - lastPosition.y);
    } else if (currentShape === 'circle') {
      const radius = Math.sqrt(Math.pow(currentPosition.x - lastPosition.x, 2) + Math.pow(currentPosition.y - lastPosition.y, 2));
      context.arc(lastPosition.x, lastPosition.y, radius, 0, Math.PI * 2, true);
    } else if (currentShape === 'sanku') {
      context.moveTo(lastPosition.x, lastPosition.y);
      context.lineTo(currentPosition.x, currentPosition.y);
      context.lineTo(lastPosition.x, currentPosition.y);
      context.closePath();
    }

    context.stroke();

    if (currentShape === 'rectangle') {
      const width = currentPosition.x - lastPosition.x;
      const height = currentPosition.y - lastPosition.y;
      setShapes((prevShapes) => [
        ...prevShapes,
        { shape: 'rectangle', x: lastPosition.x, y: lastPosition.y, width, height },
      ]);
    } else if (currentShape === 'circle') {
      const radius = Math.sqrt(Math.pow(currentPosition.x - lastPosition.x, 2) + Math.pow(currentPosition.y - lastPosition.y, 2));
      setShapes((prevShapes) => [
        ...prevShapes,
        { shape: 'circle', x: lastPosition.x, y: lastPosition.y, radius },
      ]);
    } else if (currentShape === 'sanku') {
      setShapes((prevShapes) => [
        ...prevShapes,
        { shape: 'sanku', x1: lastPosition.x, y1: lastPosition.y, x2: currentPosition.x, y2: currentPosition.y },
      ]);
    }

    setLastPosition(currentPosition); // Update the last position for the next stroke
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    setShapes([]); // Reset shapes state
    localStorage.removeItem('whiteboardDrawing'); // Remove saved data
  };

  const drawShapes = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Loop through all the shapes and draw them
    shapes.forEach((shape) => {
      context.beginPath();
      if (shape.shape === 'rectangle') {
        context.rect(shape.x, shape.y, shape.width, shape.height);
      } else if (shape.shape === 'circle') {
        context.arc(shape.x, shape.y, shape.radius, 0, 2 * Math.PI);
      } else if (shape.shape === 'sanku') {
        context.moveTo(shape.x1, shape.y1);
        context.lineTo(shape.x2, shape.y2);
        context.lineTo(shape.x1, shape.y2);
        context.closePath();
      }
      context.stroke();
    });
  };

  useEffect(() => {
    drawShapes(); // Draw all shapes stored in the shapes state
  }, [shapes]);

  return (
    <div className="bg-white p-6 w-full max-w-4xl mx-auto rounded-xl shadow-lg">
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="border border-gray-400 cursor-crosshair"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
      <div className="mt-4 flex space-x-4">
        <button
          onClick={() => setCurrentShape('rectangle')}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
        >
          Rectangle
        </button>
        <button
          onClick={() => setCurrentShape('circle')}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none"
        >
          Circle
        </button>
        <button
          onClick={() => setCurrentShape('sanku')}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 focus:outline-none"
        >
          Sanku
        </button>
        <button
          onClick={clearCanvas}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none"
        >
          Clear Whiteboar
        </button>
      </div>
    </div>
  );
};

export default Whiteboard;
