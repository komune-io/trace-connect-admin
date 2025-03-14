window._env_ = {
  config: {
    im: {
      url: "http://localhost:8009",
    },
    fs: {
      url: "http://localhost:8090",
    },
    keycloak: {
      realm: "im-test",
      clientId: "connect-admin-web",
      url: "http://im-keycloak:8080"
    },
    applications: [{
      name: "Komune Github",
      url: "https://github.com/komune-io",
      icon: "https://avatars.githubusercontent.com/u/155463261?s=200&v=4",
    }],
    theme: {
      colors: {
        primary: "#EDBA27",
        secondary: "#353945",
        background: "#FAF8F3"
      }
    }
  }
};
