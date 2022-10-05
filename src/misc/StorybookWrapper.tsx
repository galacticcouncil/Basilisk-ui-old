import { IntlProvider } from 'react-intl'
import { Locale } from './locale'
import './../index.scss'
import './shared'

export const StorybookWrapper = ({ children }: any) => {
  return (
    <IntlProvider messages={{}} locale={Locale.EN} defaultLocale="en">
      {children}
    </IntlProvider>
  )
}
