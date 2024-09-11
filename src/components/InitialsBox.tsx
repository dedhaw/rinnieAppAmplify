import React, {
  useRef,
  useState,
  useImperativeHandle,
  useEffect,
  forwardRef,
} from "react";
import "../styles/signaturebox.css";

const InitialBox = forwardRef<HTMLCanvasElement>((_, ref) => {
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [strokes, setStrokes] = useState<Array<{ x: number; y: number }[]>>([]);
  const [redoStack, setRedoStack] = useState<Array<{ x: number; y: number }[]>>(
    []
  );
  const [isDrawing, setIsDrawing] = useState(false);

  // Ensure we only assign a non-null canvas element
  useImperativeHandle(ref, () => canvasRef.current as HTMLCanvasElement);

  const getTouchCoords = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const rect = canvasRef.current?.getBoundingClientRect();
    return {
      x: touch.clientX - (rect?.left || 0),
      y: touch.clientY - (rect?.top || 0),
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault(); // Prevent scrolling
    let coords;
    if ("touches" in e) {
      coords = getTouchCoords(e);
    } else {
      const { offsetX, offsetY } = e.nativeEvent;
      coords = { x: offsetX, y: offsetY };
    }

    setStrokes([...strokes, [coords]]);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;

    let coords;
    if ("touches" in e) {
      coords = getTouchCoords(e);
    } else {
      const { offsetX, offsetY } = e.nativeEvent;
      coords = { x: offsetX, y: offsetY };
    }

    const newStrokes = [...strokes];
    const currentStroke = newStrokes.pop();
    if (currentStroke) {
      currentStroke.push(coords);
      setStrokes([...newStrokes, currentStroke]);
    }
  };

  const stopDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDrawing(false);
    setRedoStack([]);
  };

  const undo = () => {
    if (strokes.length > 0) {
      const newStrokes = [...strokes];
      const lastStroke = newStrokes.pop();
      if (lastStroke) {
        setRedoStack([...redoStack, lastStroke]);
        setStrokes(newStrokes);
      }
    }
  };

  const redo = () => {
    if (redoStack.length > 0) {
      const newRedoStack = [...redoStack];
      const lastUndoStroke = newRedoStack.pop();
      if (lastUndoStroke) {
        setStrokes([...strokes, lastUndoStroke]);
        setRedoStack(newRedoStack);
      }
    }
  };

  const drawStrokes = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.lineWidth = 4;
        context.lineCap = "round";
        context.lineJoin = "round";
        context.strokeStyle = "#000";

        strokes.forEach((stroke) => {
          context.beginPath();
          context.moveTo(stroke[0].x, stroke[0].y);
          stroke.forEach((point) => {
            context.lineTo(point.x, point.y);
          });
          context.stroke();
        });
      }
    }
  };

  useEffect(() => {
    drawStrokes();
  }, [strokes]);

  return (
    <>
      <div className="signature-container no-border">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          width={viewportWidth > 767 ? 200 : 200}
          height={viewportWidth > 767 ? 100 : 100}
          className="signature-canvas"
        />
        <div className="no-border initials-box">
          <button
            className="undo-button"
            onClick={undo}
            disabled={strokes.length === 0}
            style={{ margin: "10px", padding: "5px" }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14 19l-7-7 7-7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            className="redo-button"
            onClick={redo}
            disabled={redoStack.length === 0}
            style={{ margin: "10px", padding: "5px" }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 5l7 7-7 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
});

export default InitialBox;
