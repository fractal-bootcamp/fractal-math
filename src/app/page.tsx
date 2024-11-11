import MandelbrotSet from '../components/MandelbrotSet';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-8">Fractal Math</h1>
      <MandelbrotSet />
      <p className="mt-8 text-center max-w-md text-sm">
        This is a visualization of the Mandelbrot Set, one of the most famous fractals in mathematics.
        Each point is colored based on how quickly the sequence escapes to infinity.
      </p>
    </div>
  );
}
