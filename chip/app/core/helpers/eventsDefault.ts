import EventEmitter from "events"

export default class EventDefault<K extends string|symbol= string | symbol> extends EventEmitter {

    on< T=any >(eventName: K, listener: (args: T) => void): this {
        return super.on(eventName, listener)
    }

    emit< T=any >(eventName: K , args: T): boolean {
        return super.emit(eventName, args)
    }

    once< T=any >(eventName: K , listener: (args: T) => void): this {
        return super.once(eventName, listener)
    }
}