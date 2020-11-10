export class SalvarPublicacaoCommand {
    // idIndicadorTipo: string | undefined;
    // nome: string | undefined;
    // sigla: string | undefined;
    // valor: number | undefined;
    // ativo: boolean | undefined;

    idPublicacao: string | undefined;
    idTipoDeConteudo: string | undefined;
    idArquivo: string | undefined;
    idImagem: string | undefined;
    identificador: string | undefined;
    titulo: string | undefined;
    chamada: string | undefined;
    conteudo: string | undefined;
    tags: string | undefined;
    ativo: boolean | undefined;
    capa: boolean | undefined;
    posicaoDestaque: number | undefined;
    dataCadastro: Date | undefined;
    dataPublicacao: Date | undefined;

    public Validar() {
        // AddNotifications(new ValidationContract()
        //     .HasMaxLen(Titulo, 10, "Título", "Limite máximo de 100 caracteres.")
        //     .IsNotNullOrEmpty(Titulo, "Título", "Campo vazio.")
        //     .HasMaxLen(Identificador, 10, "Identificador", "Limite máximo de 100 caracteres.")
        //     .HasMaxLen(Chamada, 5000, "Chamada", "Limite máximo de 5000 caracteres.")
        //     .HasMaxLen(Tags, 500, "Tipo", "Limite máximo de 500 caracteres.")
        // );
    }
  }
  