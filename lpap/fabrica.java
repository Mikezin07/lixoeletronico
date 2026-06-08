public class fabrica {
    public static void main(String[] args) {
        // Criar objeto da classe cadeira
        cadeira minhaCadeira = new cadeira();
        // Atribuindo valores aos atributos da cadeira
        minhaCadeira.material = "Madeira";
        minhaCadeira.cor = "Marrom";
        minhaCadeira.altura = 1.0;
        minhaCadeira.quantidadePernas = 4;
        minhaCadeira.ocupada = false;
        // Usando o método para interagir com a cadeira
        minhaCadeira.sentar(); // Deve imprimir "Você se sentou na cadeira."
        System.out.println("Situação da cadeira: " + (minhaCadeira.ocupada ? "Ocupada" : "Livre"));
}
}