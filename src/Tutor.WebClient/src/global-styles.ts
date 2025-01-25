import { createGlobalStyle } from "styled-components"

export const GlobalStyles = createGlobalStyle`
    * {
        margin: 0px;
        padding: 0px;
        box-sizing: border-box;
    }
    
    img, i {
        vertical-align: top;
    }

    body {
        background-color: #fff;
    }

    img {
        max-width: 100%;
        max-height: 100%;
        display: block;
        object-fit: cover;
    }

    button {
        font-family: inherit;
    }
`
