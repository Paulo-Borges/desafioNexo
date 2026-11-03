const Perfil = () => {
  return (
    <div className="h-screen w-screen flex flex-col py-30 px-40 items-center justify-center">
      <div className="flex flex-col h-screen items-center justify-center">
        <h1>Meu Perfil</h1>
        <p>Confira antes de eu criar o chamado</p>
        <div className="flex flex-col -ml-18 text-xs border border-gray-200 p-4 rounded-xl space-y-2 mb-2">
          <p>
            Coloquei prioridade alta no chamado - a resposta chega antes das
            14h.
          </p>
          <p>Confira antes de eu criar o chamado</p>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
