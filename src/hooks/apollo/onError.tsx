import log from 'loglevel'

type onErrorParams = {
  error: Error
  name?: string
}

export const onError = async ({ error, name }: onErrorParams) => {
  log.error({ error, name })
}
