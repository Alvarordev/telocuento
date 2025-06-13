function Footer() {
  return (
    <footer className="flex flex-col justify-end bg-[#111827] text-white">
      <div className="w-6xl mx-auto flex py-8">
        <div className="grid grid-cols-4 gap-6 w-full">
          <div className="flex flex-col col-span-1">
            <h3 className="font-semibold text-lg mb-4">TeloCuento</h3>

            <p>Encuentra los mejores hostales en Lima</p>
          </div>

          <div className="flex flex-col col-span-1">
            <h3 className="font-semibold text-lg mb-4">Ubicaciones</h3>

            <p>Encuentra los mejores hostales en Lima</p>
          </div>

          <div className="flex flex-col col-span-1">
            <h3 className="font-semibold text-lg mb-4">Más Vistos</h3>

            <p>Encuentra los mejores hostales en Lima</p>
          </div>

          <div className="flex flex-col col-span-1">
            <h3 className="font-semibold text-lg mb-4">Comodidades</h3>

            <p>Encuentra los mejores hostales en Lima</p>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700">
        <div className="w-6xl mx-auto py-4  text-center text-sm">
          © {new Date().getFullYear()} TeloCuento. Todos los derechos
          reservados.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
