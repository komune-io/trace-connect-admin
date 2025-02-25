import {useOidc} from "@axa-fr/react-oidc";
import {useEffect, useState} from "react";

export const AuthRetryOnError = () => {
  const { login } = useOidc();
  const { protocol, hostname, port, search } = window.location;
  const searchParams = new URLSearchParams(search);
  const [retry, setRetry] = useState(searchParams.get("retry"));
  useEffect(() => {
    const base = `${protocol}//${hostname}${port ? `:${port}` : ""}`;
    if (!retry) {
      setRetry("true");
      login(base, {"retry": "true"}).catch(console.error);
    }
  }, []);
    return (
      <div>
        <div>wefwweinfnewifoewoif</div>
        <div>{retry}</div>
      </div>
    )
}
