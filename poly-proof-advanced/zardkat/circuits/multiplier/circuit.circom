pragma circom 2.0.0;

template Multiplier2 () {  
   //signal inputs
   signal input A;
   signal input B;
   //signal from gates 
   signal  X;
   signal  Y;
   //output signal
   signal output Q;

   //Gates Used
   component andG = AND();
   component notG = NOT();
   component orG = OR();

   //logic 
   andG.a <== A;
   andG.b <== B;
   notG.in <== B;

   orG.a <== andG.out;
   orG.b <== notG.out;

   Q <== orG.out;
}

template AND() {
    signal input a;
    signal input b;
    signal output out;

    out <== a*b;
}

template NOT() {
    signal input in;
    signal output out;

    out <== 1 + in - 2*in;
}

template OR() {
    signal input a;
    signal input b;
    signal output out;

    out <== a + b - a*b;
}

component main = Multiplier2();

