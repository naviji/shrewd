class RemoveCommand {
    private oldArgs: any = null
    private created: any = null

    model (): any {
      throw new Error('Needs to be overriden')
    }

    execute (o: any) {
      this.oldArgs = o
      const { id } = o
      this.created = this.model().getById(id)
      this.model().deleteById(id)
    }

    undo () {
      this.created = this.model().save(this.created)
      return this.created
    }

    redo () {
      this.execute(this.oldArgs)
    }
}

export default RemoveCommand
