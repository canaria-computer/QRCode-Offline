import { ParentProps } from "solid-js"
import PWABadge from "../PWABadge"
import Header from "../components/Header/Header"
import Footer from "../components/Footer/Footer"

export default function App(props: ParentProps) {
  return (
    <>
      <Header />
      <main>{props.children}</main>
      <Footer />
      <PWABadge />
    </>
  )
}
