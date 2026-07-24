const clear = process.argv.includes("--clear");
console.log(clear ? "O provider mock volta ao estado inicial a cada processo; nada persistido para limpar." : "Os dados demonstrativos já são fornecidos pelo MockSchedulingProvider. Para dados reais, cadastre-os no painel Easy!Appointments.");
