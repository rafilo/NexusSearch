import { Role } from 'types'
import { useAppSelector } from 'redux/provider'
import { Navigate, useLocation } from 'react-router-dom'
import { useAppDispatch } from 'redux/provider'

export const PrivateRoute = ({
  children,
  roles,
}: {
  children: JSX.Element
  roles: Array<Role>
}) => {
  let location = useLocation()
  const { isAuthenticated, user, loading } = useAppSelector(
    (state) => state.auth
  )

  if (loading) {
    return <p className="container">Checking auth..</p>
  }

  const userHasRequiredRole =
    user && roles.includes(user.role_name) ? true : false

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} />
  }

  if (isAuthenticated && !userHasRequiredRole) {
    return <div>403 Forbidden</div> // build your won access denied page (sth like 404)
  }

  return children
}
