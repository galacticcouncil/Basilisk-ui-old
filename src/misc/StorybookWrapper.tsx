import { IntlProvider } from "react-intl"
import { Locale } from "./locale"
import enMessages from '../lang/en.json'
import './shared';
import { MathProvider } from '../hooks/math/useMath';

export const StorybookWrapper = ({children}: any) => {
    return <MathProvider>
        <IntlProvider
            messages={{}}
            locale={Locale.EN}
            defaultLocale='en'
        >
            {children}
        </IntlProvider>
    </MathProvider>
}