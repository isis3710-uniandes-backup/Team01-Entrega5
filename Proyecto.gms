Sets
         i partidos
           /p1*p6/

         j apuestas
           /1*3/

Table
         tasa(i,j)      tasas de la apuesta ij
                 1       2       3
          p1  1.28    5.75      10
          p2  1.33     5.5       8
          p3  2.75     3.4    2.55
          p4  1.72       4     4.2
          p5  1.75     3.7    4.75
          p6  1.36       5     8.5;

Table
         prob(i,j)      Probabilidades de apuesta ij
                    1               2               3
          p1   0.5329          0.2352          0.2319
          p2   0.7574          0.1546           0.088
          p3   0.4958          0.2543          0.2499
          p4   0.3759          0.2432          0.3809
          p5   0.6789          0.2004          0.1207
          p6   0.7575          0.1622          0.0802;

Scalar
         p  Presupuesto
          /40000/ ;

Positive Variable
         c(i,j) dinero que se apuesta en la combinación ij

Variable
         z Maximizacion;

Equations
         func_obj        Función Objetivo
         res_pres        Restricción presupuesto;

         func_obj        ..      z =e= sum((i,j), (prob(i,j)*tasa(i,j)*c(i,j))-(c(i,j)*(1-prob(i,j))));
         res_pres        ..      sum((i,j), c(i,j)) =l= p;

Model Proyecto /all/;
option mip=CPLEX
Solve Proyecto using mip maximizing z;

Display c.l
Display z.l

