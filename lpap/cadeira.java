
/** 
// instrução para criar uma classe chamada cadeira
*/
class cadeira {
    // Atributos da classe cadeira - dar forma ao objeto
    String material;
    String cor;
    double altura;
    float quantidadePernas;
    boolean ocupada;
// Método para sentar na cadeira - dar comportamento ao objeto
    void sentar() {
        if (!ocupada) {
            ocupada = true;
            System.out.println("Você se sentou na cadeira.");
        } else {
            System.out.println("A cadeira já está ocupada.");
        }
    }
}
