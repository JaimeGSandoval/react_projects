import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <main className="App">
      {/* The outlet component represents all the children of the layout component. So anything nested inside the layout component is represented by the outlet component. This allows you to apply more things to your over all app. You could have a header component in here, footer, etc. You can also have more than one outlet as you create routing inside of our application. So everything will be nested inside of this layout component*/}
      <Outlet />
    </main>
  );
};

export default Layout;
