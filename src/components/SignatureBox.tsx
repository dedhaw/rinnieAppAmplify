import React, {
  useRef,
  useState,
  useImperativeHandle,
  useEffect,
  forwardRef,
} from "react";
import "../styles/signaturebox.css";

interface Point {
  x: number;
  y: number;
}

interface SignatureBoxProps {
  containerWidth?: number;
  containerHeight?: number;
}

const SignatureBox = forwardRef<HTMLCanvasElement, SignatureBoxProps>(
  ({ containerWidth = 300, containerHeight = 150 }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [strokes, setStrokes] = useState<Point[][]>([]);
    const [redoStack, setRedoStack] = useState<Point[][]>([]);
    const [isDrawing, setIsDrawing] = useState(false);

    useImperativeHandle(ref, () => canvasRef.current as HTMLCanvasElement);

    const getPointerPosition = (
      e: React.TouchEvent | React.MouseEvent
    ): Point => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };

      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      if (e.nativeEvent instanceof TouchEvent) {
        const touch = e.nativeEvent.touches[0];
        return {
          x: (touch.clientX - rect.left) * scaleX,
          y: (touch.clientY - rect.top) * scaleY,
        };
      } else {
        return {
          x: (e.nativeEvent.clientX - rect.left) * scaleX,
          y: (e.nativeEvent.clientY - rect.top) * scaleY,
        };
      }
    };

    const startDrawing = (e: React.TouchEvent | React.MouseEvent) => {
      const point = getPointerPosition(e);
      setStrokes([...strokes, [point]]);
      setIsDrawing(true);
    };

    const draw = (e: React.TouchEvent | React.MouseEvent) => {
      if (!isDrawing) return;

      const point = getPointerPosition(e);
      const newStrokes = [...strokes];
      const currentStroke = newStrokes[newStrokes.length - 1];
      currentStroke.push(point);
      setStrokes(newStrokes);
    };

    const stopDrawing = () => {
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
          context.lineWidth = 2;
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

    useEffect(() => {
      const canvas = canvasRef.current;
      if (canvas) {
        const handleTouchStart = (e: TouchEvent) => {
          e.preventDefault();
          startDrawing(e as unknown as React.TouchEvent);
        };
        const handleTouchMove = (e: TouchEvent) => {
          e.preventDefault();
          draw(e as unknown as React.TouchEvent);
        };
        const handleTouchEnd = () => stopDrawing();

        canvas.addEventListener("touchstart", handleTouchStart, {
          passive: false,
        });
        canvas.addEventListener("touchmove", handleTouchMove, {
          passive: false,
        });
        canvas.addEventListener("touchend", handleTouchEnd);
        canvas.addEventListener("touchcancel", handleTouchEnd);

        return () => {
          canvas.removeEventListener("touchstart", handleTouchStart);
          canvas.removeEventListener("touchmove", handleTouchMove);
          canvas.removeEventListener("touchend", handleTouchEnd);
          canvas.removeEventListener("touchcancel", handleTouchEnd);
        };
      }
    }, [isDrawing]);

    return (
      <div
        className="signature-container"
        style={{ width: containerWidth, height: containerHeight }}
      >
        <canvas
          ref={canvasRef}
          width={containerWidth}
          height={containerHeight}
          className="signature-canvas"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
        <div className="signature-controls">
          <button
            className="undo-button"
            onClick={undo}
            disabled={strokes.length === 0}
          >
            Undo
          </button>
          <button
            className="redo-button"
            onClick={redo}
            disabled={redoStack.length === 0}
          >
            Redo
          </button>
        </div>
      </div>
    );
  }
);

export default SignatureBox;
