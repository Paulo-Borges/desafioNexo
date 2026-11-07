import { USER_CREATE } from "../../api_Fake";

const LoginCreate: React.FC = () => {
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const { url, options } = USER_CREATE({
      username: (event.target as HTMLFormElement).username.value,
      email: (event.target as HTMLFormElement).email.value,
      password: (event.target as HTMLFormElement).password.value,
    });
    const response = await fetch(url, options);
    console.log(response);
  };

  return (
    <section className="flex flex-col items-center justify-center">
      <h1>Criar Conta</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center justify-center"
      >
        <div className="flex flex-col">
          <label htmlFor="username">Usuário</label>
          <input
            type="text"
            id="username"
            name="username"
            required
            className="border p-2 rounded"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="border p-2 rounded"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="password">Senha</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            className="border p-2 rounded"
          />
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white p-2 rounded"
        >
          Criar Conta
        </button>
      </form>
    </section>
  );
};

export default LoginCreate;
