import { IntlProvider } from "react-intl"
import { Locale } from "./locale"
import enMessages from '../lang/en.json'
import './shared';

export const StorybookWrapper = ({children}: any) => {
    return <IntlProvider
        messages={{}}
        locale={Locale.EN}
        defaultLocale='en'
    >
        {children}
    </IntlProvider>
}