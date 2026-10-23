import { Link, type LinkProps } from 'react-router'
import { buttonClassName, type ButtonStyleProps } from './buttonClassName'

type ButtonLinkProps = LinkProps & ButtonStyleProps

/** Ссылка роутера, которая выглядит как Button. */
export function ButtonLink({ variant, size, fullWidth, className, ...rest }: ButtonLinkProps) {
  return <Link className={buttonClassName({ variant, size, fullWidth }, className)} {...rest} />
}
