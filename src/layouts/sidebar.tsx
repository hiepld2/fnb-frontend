import { NavBarCollapse } from './navbar-collapse'
import { NavBarExpand } from './navbar-expand'

interface SideNavbarProps {
  collapsed?: boolean
  onToggle?: () => void
}

export function SideNavbar({ collapsed = false, onToggle }: SideNavbarProps) {
  return collapsed ? <NavBarCollapse onToggle={onToggle} /> : <NavBarExpand onToggle={onToggle} />
}
