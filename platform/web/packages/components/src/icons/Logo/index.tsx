import { MergeReactElementProps } from '@komune-io/g2'

interface LogoProps {
}

type Props = MergeReactElementProps<'img', LogoProps>

export const Logo =  (props: Props) => {
  return <img style={props.style} src={props.src} alt="App Icon" />;
}
