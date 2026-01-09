function Layout({ children }) {
  return (
    <div className="page-wrapper">
      <div className="container">{children}</div>
    </div>
  );
}

export default Layout;
