import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowRight,
  lucideTrophy,
  lucideTruck,
  lucideShieldCheck,
  lucideTag,
} from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { hlmH1, hlmH3, hlmLead, hlmMuted } from '@spartan-ng/helm/typography';

interface Category {
  name: string;
  description: string;
}

interface Feature {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-landing',
  imports: [
    RouterLink,
    NgIcon,
    HlmIcon,
    HlmButtonImports,
    HlmCardImports,
    HlmBadgeImports,
  ],
  providers: [
    provideIcons({
      lucideArrowRight,
      lucideTrophy,
      lucideTruck,
      lucideShieldCheck,
      lucideTag,
    }),
  ],
  templateUrl: './landing.html',
})
export class Landing {
  readonly h1 = hlmH1;
  readonly h3 = hlmH3;
  readonly lead = hlmLead;
  readonly muted = hlmMuted;

  readonly categories: Category[] = [
    { name: 'Futebol', description: 'Chuteiras, bolas e uniformes', },
    { name: 'Basquete', description: 'Tênis, bolas e acessórios', },
    { name: 'Corrida', description: 'Tênis, roupas e gadgets', },
    { name: 'Tênis', description: 'Raquetes, bolas e calçados', },
  ];

  readonly features: Feature[] = [
    {
      icon: 'lucideTruck',
      title: 'Frete rápido',
      description: 'Entrega para todo o Brasil em poucos dias.',
    },
    {
      icon: 'lucideShieldCheck',
      title: 'Compra segura',
      description: 'Pagamento protegido e garantia em todo pedido.',
    },
    {
      icon: 'lucideTag',
      title: 'Melhores preços',
      description: 'Promoções semanais nas principais marcas.',
    },
    {
      icon: 'lucideTrophy',
      title: 'Qualidade Pista',
      description: 'Produtos selecionados para alta performance.',
    },
  ];
}
