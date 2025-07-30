const LoadingSkeleton = () => (
  <div className="flex flex-col justify-center items-center h-64 text-gray-500 animate-pulse">
    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    <p className="mt-4 text-sm">Carregando informações...</p>
  </div>
);


export default LoadingSkeleton;
