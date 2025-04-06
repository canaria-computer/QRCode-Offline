import { ParentProps } from "solid-js"

export default function App(props: ParentProps) {
  return (
    <div class="global-layout">
      <header>...Todo</header>
      <main>{props.children}</main>
      <footer>...Todo</footer>
    </div>
  )
}
